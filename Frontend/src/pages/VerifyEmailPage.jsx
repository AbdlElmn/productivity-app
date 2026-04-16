import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const { verifyEmail, resendVerificationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email ?? "";
  const registerMessage = location.state?.message ?? "";

  const [form, setForm] = useState({ email: initialEmail, code: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(registerMessage);
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const normalizedEmail = useMemo(() => form.email.trim().toLowerCase(), [form.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "code") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setForm((current) => ({ ...current, code: digitsOnly }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const response = await verifyEmail({
        email: normalizedEmail,
        code: form.code,
      });
      setVerified(true);
      setNotice(response.message || "Email verified successfully.");
      setTimeout(() => {
        navigate("/signin", {
          replace: true,
          state: {
            email: normalizedEmail,
            verified: true,
          },
        });
      }, 1200);
    } catch (submitError) {
      setVerified(false);
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!normalizedEmail) {
      setError("Email is required before resending the code.");
      return;
    }

    setError("");
    setResending(true);

    try {
      const response = await resendVerificationCode(normalizedEmail);
      setNotice(response.message || "A new verification code has been sent.");
    } catch (resendError) {
      setError(resendError.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Verify email"
      title="Enter verification code"
      description="Use the 6-digit code sent to your inbox. The code expires in 10 minutes."
      alternateLabel="Back to sign in?"
      alternateTo="/signin"
      alternateAction="Sign in"
    >
      <form className="space-y-5" onSubmit={handleVerify}>
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

        <Field label="Verification code" hint="6 digits">
          <Input
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={form.code}
            onChange={handleChange}
            placeholder="123456"
            required
          />
        </Field>

        {notice ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
              verified
                ? "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20"
                : "bg-sky-400/10 text-sky-200 ring-sky-300/20"
            }`}
          >
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-300/15">
            {error}
          </div>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={submitting}>
          {submitting ? "Verifying..." : "Verify email"}
        </Button>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            size="md"
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={resending || !normalizedEmail}
          >
            {resending ? "Resending..." : "Resend code"}
          </Button>
          <Button
            className="flex-1"
            size="md"
            type="button"
            variant="ghost"
            onClick={() =>
              navigate("/signin", {
                state: { email: normalizedEmail },
              })
            }
          >
            Back to sign in
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
