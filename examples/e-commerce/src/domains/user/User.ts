
const LOCALSTORAGE_USER_KEY = 'user'

export interface UserType {
  id: number
  email: string
  username: string
  password: string
  name: {
    firstname: string
    lastname: string
  }
  phone: string
  address: {
    geolocation: {
      lat: string
      long: string
    }
    city: string
    street: string
    number: number
    zipcode: string
  }
}

class UserDomain {
  private user: UserType | undefined

  async restoreUser(): Promise<UserType | undefined> {
    const str = localStorage.getItem(LOCALSTORAGE_USER_KEY)
    if (!str) {
      return undefined
    }
    this.user = JSON.parse(str) as UserType
    return this.user
  }

  async login({ username }: { username: string }): Promise<UserType | undefined> {
    const r = await fetch(`https://fakestoreapi.com/users`)
    const users = await r.json() as UserType[]
    this.user = users.find(u => u.username === username)
    if (this.user) {
      localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(this.user))
    }
    return this.user
  }

  async logout() {
    this.user = undefined
    localStorage.removeItem(LOCALSTORAGE_USER_KEY)
  }

  async getUser(): Promise<UserType | undefined> {
    return this.user
  }
}

export const userDomain = new UserDomain()
