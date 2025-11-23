-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for events
create table events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  creator_id uuid references profiles(id) not null,
  title text not null,
  location text not null,
  time timestamp with time zone not null,
  type text not null,
  notes text
);

alter table events enable row level security;

create policy "Events are viewable by everyone."
  on events for select
  using ( true );

create policy "Users can create events."
  on events for insert
  with check ( auth.uid() = creator_id );

-- Create a table for event attendees
create table attendees (
  event_id uuid references events(id) not null,
  user_id uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (event_id, user_id)
);

alter table attendees enable row level security;

create policy "Attendees are viewable by everyone."
  on attendees for select
  using ( true );

create policy "Users can join events."
  on attendees for insert
  with check ( auth.uid() = user_id );

create policy "Users can leave events."
  on attendees for delete
  using ( auth.uid() = user_id );

-- Create a table for friendships
create table friendships (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  friend_id uuid references profiles(id) not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

alter table friendships enable row level security;

create policy "Users can see their own friendships."
  on friendships for select
  using ( auth.uid() = user_id or auth.uid() = friend_id );

create policy "Users can request friendship."
  on friendships for insert
  with check ( auth.uid() = user_id );

create policy "Users can update friendship status."
  on friendships for update
  using ( auth.uid() = friend_id );

-- Set up Storage for Avatars
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
