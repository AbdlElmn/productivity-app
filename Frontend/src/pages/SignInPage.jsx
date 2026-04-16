import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const { login, resendVerificationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname;
  const normalizedEmail = useMemo(() => form.email.trim().toLowerCase(), [form.email]);

  useEffect(() => {
    if (location.state?.email) {
      setForm((current) => ({ ...current, email: location.state.email }));
    }
    if (location.state?.verified) {
      setInfo("Email verified successfully. You can sign in now.");
    }
  }, [location.state]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setNeedsVerification(false);
    setSubmitting(true);

    try {
      const response = await login(form);
      navigate(redirectTo || (response.user.role === "ADMIN" ? "/admin" : "/app"), {
        replace: true,
      });
    } catch (submitError) {
      setError(submitError.message);
      setNeedsVerification(
        submitError.message.toLowerCase().includes("not verified") ||
          submitError.status === 403
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!normalizedEmail) {
      setError("Enter your email first, then request a new verification code.");
      return;
    }

    setError("");
    setInfo("");
    setResending(true);

    try {
      const response = await resendVerificationCode(normalizedEmail);
      setInfo(response.message || "A new verification code has been sent.");
      setNeedsVerification(true);
    } catch (resendError) {
      setError(resendError.message);
    } finally {
      setResending(false);
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

        {info ? (
          <div className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-300/20">
            {info}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-300/15">
            {error}
          </div>
        ) : null}

        {needsVerification ? (
          <div className="space-y-3 rounded-2xl bg-sky-400/10 px-4 py-4 text-sm text-sky-100 ring-1 ring-sky-300/20">
            <p>Your email is not verified yet.</p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  navigate("/verify-email", {
                    state: { email: normalizedEmail },
                  })
                }
              >
                Verify email
              </Button>
              <Button
                className="flex-1"
                type="button"
                size="sm"
                variant="ghost"
                disabled={resending || !normalizedEmail}
                onClick={handleResend}
              >
                {resending ? "Resending..." : "Resend code"}
              </Button>
            </div>
          </div>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
