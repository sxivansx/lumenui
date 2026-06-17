import { Avatar, AvatarFallback, AvatarImage } from '@shivansh.life/lumenui'

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" alt="@lumenui" />
      <AvatarFallback>LU</AvatarFallback>
    </Avatar>
  )
}
