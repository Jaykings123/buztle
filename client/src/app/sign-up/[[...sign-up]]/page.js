import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            <SignUp routing="path" path="/sign-up" />
        </div>
    );
}
