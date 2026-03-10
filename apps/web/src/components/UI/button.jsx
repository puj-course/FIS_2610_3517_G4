// Importa una función utilitaria para combinar clases de Tailwind
import { cn } from '@/lib/utils';

// Slot permite renderizar el botón como otro elemento (por ejemplo un <a>)
import { Slot } from '@radix-ui/react-slot';

// Librería para crear variantes de clases CSS fácilmente
import { cva } from 'class-variance-authority';

// Importa React
import React from 'react';


// Definimos las variantes del botón usando cva
const buttonVariants = cva(
  // Clases base que SIEMPRE tendrá el botón
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

  {
    // Definimos variaciones del botón
    variants: {

      // Diferentes estilos de botón
      variant: {
        // Botón principal
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',

        // Botón para acciones peligrosas (ej: eliminar)
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',

        // Botón con borde
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',

        // Botón secundario
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',

        // Botón tipo fantasma (sin fondo)
        ghost: 'hover:bg-accent hover:text-accent-foreground',

        // Botón que se ve como un link
        link: 'text-primary underline-offset-4 hover:underline',
      },

      // Tamaños del botón
      size: {
        // Tamaño normal
        default: 'h-10 px-4 py-2',

        // Tamaño pequeño
        sm: 'h-9 rounded-md px-3',

        // Tamaño grande
        lg: 'h-11 rounded-md px-8',

        // Tamaño para iconos
        icon: 'h-10 w-10',
      },
    },

    // Valores por defecto si no se especifica nada
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);


// Creamos el componente Button
// forwardRef permite pasar referencias (ref) desde componentes padres
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {

    // Si asChild es true usa Slot (para poder usar otro elemento como <a>)
    // si no usa el elemento button normal
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        // Combina las clases base + variantes + clases adicionales
        className={cn(buttonVariants({ variant, size, className }))}

        // Permite acceder al elemento desde fuera
        ref={ref}

        // Pasa todas las props restantes
        {...props}
      />
    );
  }
);

// Nombre del componente para debugging en React DevTools
Button.displayName = 'Button';


// Exportamos el botón y las variantes para usarlas en otros archivos
export { Button, buttonVariants };