export interface Organization {
  id: string;
  name: string;
  username: string;
}

export interface Certificate {
  recipientName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
  organizationName: string;
  courseDuration: string;
  qrCode: string;
  hash: string;
}