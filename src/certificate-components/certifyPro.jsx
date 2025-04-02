"use client";

import { useState } from "react";
import AuthForm from "./auth";
import CertificateForm from "./certificate";
import { Award } from "lucide-react";
import ValidationForm from "./validate";
import { Button } from "./ecomponents/ui/button";

  export default function CertifyPro() {
    const [organization, setOrganization] = useState(null);
    const [validation, setvalidation] = useState(false);

    const handleAuth = async (data) => {
      try {
        const res = await fetch("http://localhost:3000/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, isRegistering: !!data.name }),
          credentials: "include",
        });
    
        const result = await res.json();
    
        if (!res.ok) {
          alert(result.error);
          return;
        }
    
        setOrganization(result);
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CertifyPro</h1>
          </div>
          {organization && (<div>
            <Button onClick={() => setvalidation(true)}>Validation</Button>
            <div className="text-gray-600">
              Welcome, {organization.name}
            </div>
          </div>
          )}
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        { validation ? <ValidationForm /> :

        !organization ? (
          <AuthForm onLogin={handleAuth} setValidation={setvalidation} />
        ):

         (
          <CertificateForm organizationName={organization.name} />
        )
        
        }
      </main>
    </div>
  );
}
