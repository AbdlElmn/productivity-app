import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await login(form);
      navigate(redirectTo || (response.user.role === "ADMIN" ? "/admin" : "/app"), {
        replace: true,
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Access your workspace and continue the work that matters most."
      alternateLabel="Need an account?"
      alternateTo="/signup"
      alternateAction="Create one"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Email">
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label="Password">
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </Field>

        {error ? (
          <div className="rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-300/15">
            {error}
          </div>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
