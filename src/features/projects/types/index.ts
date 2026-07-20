export interface Project {
  id: string
  name: string
  description: string
  teamType: 'solo' | 'team'
  githubLink?: string
  designLink?: string
  demoLink?: string
  status: 'complete' | 'progress' | 'paused'
  experience: string
  ownerId: string
  owner?: {
    id: string
    name: string
    email: string
  }
  techs: Array<{
    id: string
    name: string
    slug: string
    iconUrl: string
  }>
  images?: Array<{
    id: string
    url: string
    type: 'mockup' | 'post'
    filename: string
  }>
  created_at: string
  updated_at: string
}

export interface ProjectFormValues {
  name: string
  description: string
  teamType: 'solo' | 'team'
  githubLink?: string
  designLink?: string
  status: 'complete' | 'progress' | 'paused'
  experience: string
  techIds: string[]
}
