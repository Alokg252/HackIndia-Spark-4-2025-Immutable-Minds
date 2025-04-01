// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoursePayment is Ownable, ReentrancyGuard {
    struct Course {
        string title;
        string description;
        uint256 price;
        bool exists;
    }

    struct Purchase {
        address user;
        uint256 courseId;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Course) public courses;
    mapping(address => mapping(uint256 => bool)) public userPurchases;
    mapping(uint256 => Purchase[]) public coursePurchases;
    uint256 public courseCount;
    uint256 public totalPurchases;

    event CourseCreated(uint256 indexed courseId, string title, uint256 price);
    event CoursePurchased(uint256 indexed courseId, address indexed user, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createCourse(
        string memory _title,
        string memory _description,
        uint256 _price
    ) external onlyOwner {
        require(_price > 0, "Price must be greater than 0");
        
        courseCount++;
        courses[courseCount] = Course({
            title: _title,
            description: _description,
            price: _price,
            exists: true
        });

        emit CourseCreated(courseCount, _title, _price);
    }

    function purchaseCourse(uint256 _courseId) external payable nonReentrant {
        require(courses[_courseId].exists, "Course does not exist");
        require(!userPurchases[msg.sender][_courseId], "Already purchased");
        require(msg.value >= courses[_courseId].price, "Insufficient payment");

        userPurchases[msg.sender][_courseId] = true;
        totalPurchases++;

        coursePurchases[_courseId].push(Purchase({
            user: msg.sender,
            courseId: _courseId,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit CoursePurchased(_courseId, msg.sender, msg.value);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");

        emit Withdrawn(owner(), balance);
    }

    function getCourse(uint256 _courseId) external view returns (
        string memory title,
        string memory description,
        uint256 price,
        bool exists
    ) {
        Course memory course = courses[_courseId];
        return (course.title, course.description, course.price, course.exists);
    }

    function getUserPurchases(address _user) external view returns (uint256[] memory) {
        uint256[] memory purchasedCourses = new uint256[](courseCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= courseCount; i++) {
            if (userPurchases[_user][i]) {
                purchasedCourses[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = purchasedCourses[i];
        }

        return result;
    }

    function getCoursePurchases(uint256 _courseId) external view returns (Purchase[] memory) {
        return coursePurchases[_courseId];
    }
} 