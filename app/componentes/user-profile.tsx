'use client'

import { useAuth } from '../contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function UserProfile() {
  const { currentUser, logout } = useAuth()
  const { toast } = useToast()

  if (!currentUser) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
        >
          <span className="mr-2">👤</span>
          <span className="max-w-[120px] truncate">{currentUser.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-zinc-700 bg-zinc-900 text-zinc-100">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <div className="px-2 py-2 text-sm">
          <p className="font-semibold">{currentUser.username}</p>
          <p className="text-xs text-zinc-400">{currentUser.email}</p>
          <p className="mt-1 text-xs text-zinc-500" suppressHydrationWarning>
            Miembro desde: {new Date(currentUser.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 focus:bg-red-950 focus:text-red-300"
        >
          <span className="mr-2">🚪</span>
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
