import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup(form);
      navigate("/app", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Get started"
      description="Set up your workspace in a minute and begin tracking focused work right away."
      alternateLabel="Already registered?"
      alternateTo="/signin"
      alternateAction="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Username">
          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="How should we refer to you?"
            required
          />
        </Field>

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
            placeholder="Create a secure password"
            required
          />
        </Field>

        {error ? (
          <div className="rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-300/15">
            {error}
          </div>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
