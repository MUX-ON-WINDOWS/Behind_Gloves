import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    // If already logged in, go to dashboard
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(creds.username, creds.password)) {
            navigate("/", { replace: true });
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-sm p-6 bg-card rounded-lg shadow">
                <div className=" max-w-sm">
                    <img
                        src="/logo.png"
                        alt="Logo" className="mx-auto h-auto w-auto"
                    />
                </div>
                <h2 className="mb-4 text-2xl font-semibold text-center">Login</h2>
                {error && <p className="mb-4 text-center text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 text-sm font-medium">
                            Username
                        </label>
                        <Input
                            id="username"
                            type="text"
                            value={creds.username}
                            onChange={(e) =>
                                setCreds({ ...creds, username: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={creds.password}
                            onChange={(e) =>
                                setCreds({ ...creds, password: e.target.value })
                            }
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>

    );
};

export default Login; 