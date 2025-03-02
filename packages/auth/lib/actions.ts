'use server';

import { z } from 'zod';
import { hash } from 'bcrypt-ts';

import { createUser, getUser } from '@weown/database';

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authenticate(
  prevState: { status?: string; message?: string },
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      return {
        status: 'error',
        message: 'Invalid credentials',
      };
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  try {
    const validatedFields = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const { email, password } = validatedFields;

    const existingUser = await getUser({ email });

    if (existingUser) {
      return { status: 'user_exists' };
    }

    const hashedPassword = await hash(password, 10);

    await createUser({
      email,
      password: hashedPassword,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
}; 