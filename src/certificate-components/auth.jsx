"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ecomponents/ui/button";
import { Input } from "./ecomponents/ui/input";
import { Label } from "./ecomponents/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ecomponents/ui/card";

function AuthForm({ onLogin, setValidation }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { register, handleSubmit } = useForm();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isRegistering ? "Register Organization" : "Login"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          {isRegistering && (
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                {...register("name", { required: isRegistering })}
              />
            </div>
          )}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Button type="submit" className="w-full">
              {isRegistering ? "Register" : "Login"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an account? Login" : "Create Organization Account"}
            </Button>
            <div className={`${isRegistering ? "hidden" : ""}`}>
              <hr className="mt-5 font-bold" />
              <div className="text-center bg-gradient-to-r from-white via-gray-300 to-white" >OR</div>
              <hr className="font-bold" />

              <Button
                type="button"
                variant="outline"
                className="w-full mt-5"
                onClick={() => setValidation(true)}
                >
                {"Validate Certificate"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
export default AuthForm;