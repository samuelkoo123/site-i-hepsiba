
import { Inquiry, Resource, GuestbookEntry, Testimony, Sponsorship, CalendarEvent } from './types';

export const db = {
  async save(type: 'inquiry' | 'resource' | 'guestbook' | 'testimony' | 'sponsorship' | 'calendar', payload: any): Promise<{ success: boolean, error?: string }> {
    try {
      const data = {
        id: payload.id || Math.random().toString(36).substr(2, 9),
        date: payload.date || new Date().toISOString().split('T')[0],
        ...payload
      };

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbCategory: type, ...data })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown server error' }));
        return { success: false, error: errData.details || errData.error || 'Server error' };
      }
      
      return { success: true };
    } catch (e) {
      console.error('Save Error:', e);
      return { success: false, error: (e as Error).message };
    }
  },

  async getAll(): Promise<{
    inquiries: Inquiry[],
    resources: Resource[],
    guestbook: GuestbookEntry[],
    testimonies: Testimony[],
    sponsorships: Sponsorship[],
    calendarEvents: CalendarEvent[]
  }> {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (e) {
      console.error('Fetch Error:', e);
      return {
        inquiries: [],
        resources: [],
        guestbook: [],
        testimonies: [],
        sponsorships: [],
        calendarEvents: []
      };
    }
  },

  async delete(type: string, id: string): Promise<boolean> {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type })
      });
      return response.ok;
    } catch (e) {
      console.error('Delete Error:', e);
      return false;
    }
  }
};
