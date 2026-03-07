export type ApplicationStatus = 'pending' | 'shortlisted' | 'messaged' | 'booked' | 'accepted' | 'declined' | 'withdrawn';

export interface Application {
  id: string;
  workerId: string;
  roleId: string;
  eventId: string;
  status: ApplicationStatus;
  note: string;
  appliedAt: string;
}

export const mockApplications: Application[] = [
  { id: 'a1', workerId: 'w1', roleId: 'r1', eventId: 'e1', status: 'shortlisted', note: 'I have 3 years of event DJing experience and a full setup.', appliedAt: '2 hrs ago' },
  { id: 'a2', workerId: 'w2', roleId: 'r2', eventId: 'e1', status: 'booked', note: 'Available for this date, portfolio linked below.', appliedAt: '3 hrs ago' },
  { id: 'a3', workerId: 'w3', roleId: 'r3', eventId: 'e1', status: 'pending', note: 'Can deliver a 60-sec highlight reel within 24hrs.', appliedAt: '1 hr ago' },
  { id: 'a4', workerId: 'w13', roleId: 'r1', eventId: 'e1', status: 'pending', note: 'K-Pop specialist but love Greek events too!', appliedAt: '30 min ago' },
  { id: 'a5', workerId: 'w8', roleId: 'r1', eventId: 'e1', status: 'pending', note: 'Brooklyn\'s finest DJ, ready to bring the energy.', appliedAt: '45 min ago' },
  { id: 'a6', workerId: 'w4', roleId: 'r2', eventId: 'e1', status: 'pending', note: 'Great with crowd interaction, can also help with photos.', appliedAt: '2 hrs ago' },
  { id: 'a7', workerId: 'w7', roleId: 'r2', eventId: 'e1', status: 'pending', note: 'Love shooting parties, have a great portfolio.', appliedAt: '1 hr ago' },
  { id: 'a8', workerId: 'w2', roleId: 'r4', eventId: 'e2', status: 'pending', note: 'Perfect for professional events, clean editorial style.', appliedAt: '5 hrs ago' },
  { id: 'a9', workerId: 'w6', roleId: 'r5', eventId: 'e2', status: 'pending', note: 'NYC bartender with full cocktail experience.', appliedAt: '3 hrs ago' },
  { id: 'a10', workerId: 'w12', roleId: 'r5', eventId: 'e2', status: 'booked', note: 'Craft cocktails specialist. Ready to go!', appliedAt: '6 hrs ago' },
  { id: 'a11', workerId: 'w1', roleId: 'r6', eventId: 'e3', status: 'pending', note: 'Techno and house is my home ground.', appliedAt: '1 day ago' },
  { id: 'a12', workerId: 'w8', roleId: 'r6', eventId: 'e3', status: 'pending', note: 'Underground specialist, have played at this venue before.', appliedAt: '1 day ago' },
  { id: 'a13', workerId: 'w3', roleId: 'r7', eventId: 'e3', status: 'pending', note: 'Great with low-light cinematic footage.', appliedAt: '1 day ago' },
  { id: 'a14', workerId: 'w5', roleId: 'r8', eventId: 'e4', status: 'pending', note: '45k IG followers, specialized in brand content.', appliedAt: '2 days ago' },
  { id: 'a15', workerId: 'w10', roleId: 'r8', eventId: 'e4', status: 'pending', note: 'TikTok creator with brand partnerships experience.', appliedAt: '2 days ago' },
  { id: 'a16', workerId: 'w2', roleId: 'r9', eventId: 'e4', status: 'pending', note: 'Brand and editorial photography is my specialty.', appliedAt: '2 days ago' },
  { id: 'a17', workerId: 'w16', roleId: 'r9', eventId: 'e4', status: 'pending', note: 'Fine art meets brand photography. Check my portfolio.', appliedAt: '1 day ago' },
  { id: 'a18', workerId: 'w4', roleId: 'r10', eventId: 'e5', status: 'pending', note: 'Energy is my middle name. Perfect for outdoor MC work.', appliedAt: '3 days ago' },
  { id: 'a19', workerId: 'w11', roleId: 'r10', eventId: 'e5', status: 'booked', note: 'Bilingual MC, English and Spanish. Perfect for NYU.', appliedAt: '3 days ago' },
  { id: 'a20', workerId: 'w19', roleId: 'r11', eventId: 'e5', status: 'pending', note: 'NYU student, love covering campus events!', appliedAt: '2 days ago' },
  { id: 'a21', workerId: 'w1', roleId: 'r13', eventId: 'e6', status: 'pending', note: 'Afrobeats and hip-hop is my core genre.', appliedAt: '4 days ago' },
  { id: 'a22', workerId: 'w13', roleId: 'r16', eventId: 'e8', status: 'pending', note: 'K-Pop DJ, this event was made for me!', appliedAt: '1 day ago' },
  { id: 'a23', workerId: 'w5', roleId: 'r17', eventId: 'e8', status: 'pending', note: 'K-Pop fan and content creator. Let\'s create fire content!', appliedAt: '1 day ago' },
];
