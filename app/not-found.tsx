import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Ghost, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      <div className="space-y-8 max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="relative rounded-full bg-primary/10 p-8 ring-1 ring-primary/20">
            <Ghost className="h-24 w-24 text-primary animate-pulse" strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-7xl font-extrabold tracking-tight text-primary">
            404
          </h1>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Oups ! Page introuvable
          </h2>
          <p className="text-muted-foreground text-lg pt-2 leading-relaxed">
            Désolé, nous n'avons pas pu trouver la page que vous recherchez. 
            Elle a peut-être été déplacée, supprimée ou n'a jamais existé.
          </p>
        </div>

        <div className="pt-6">
          <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
