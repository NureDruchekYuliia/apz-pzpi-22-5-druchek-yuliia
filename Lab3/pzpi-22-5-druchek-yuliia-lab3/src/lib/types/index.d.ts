type Character = {
    id: string
    name: string
    description: string
    photoUrl: string
    visibility: number
    likesCount: number
    traits: unknown[]
    relationships: unknown[]
    characterPhotos: unknown[]
    user: User
}

type User = {
  id: string
  email: string
  role: 'User' | 'Admin';
}