'use server'

import { revalidatePath } from 'next/cache'

export interface Member {
  id: string;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMembers(): Promise<Member[]> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  
  return response.json();
}

export async function createMember(name: string): Promise<Member> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create member');
  }
  
  revalidatePath('/members');
  return response.json();
}

export async function deleteMember(id: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete member');
  }
  
  const result = await response.json();
  return result.success;
}

