import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/ui/button';
import { FormField } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginValues = z.infer<typeof loginSchema>;

const DEMO = { email: 'admin@ims.dev', password: 'admin123' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Welcome back. Enter your details to continue.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" required error={errors.email?.message}>
          <Input type="email" autoComplete="email" placeholder="you@company.com" {...register('email')} />
        </FormField>
        <FormField label="Password" required error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} />
        </FormField>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Spinner className="h-4 w-4" />}
          Sign in
        </Button>
      </form>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs">
            <p className="font-medium text-neutral-700">Demo account</p>
            <p className="text-neutral-400">admin@ims.dev · admin123</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setValue('email', DEMO.email);
              setValue('password', DEMO.password);
            }}
          >
            Use demo
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don’t have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
