// Funcion utilitaria para combinar clases de Tailwind
import { cn } from '@/lib/utils';

// Importa todos los componentes base de Toast desde Radix UI
import * as ToastPrimitives from '@radix-ui/react-toast';

// Libreria para crear variantes de estilos (por ejemplo default o error)
import { cva } from 'class-variance-authority';

// Icono de cerrar desde la libreria Lucide
import { X } from 'lucide-react';

// Importa React
import React from 'react';


// Provider que habilita el sistema de Toast en la aplicacion
// Debe envolver la app o la parte donde se usaran los toasts
const ToastProvider = ToastPrimitives.Provider;


// Componente que define donde se mostraran los toasts en la pantalla
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}

		// Combina clases base con clases personalizadas
		className={cn(
			// Posicion del toast en pantalla
			// En movil arriba, en desktop abajo derecha
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}

		// Pasa las otras propiedades
		{...props}
	/>
));

// Nombre del componente para React DevTools
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;


// Define variantes visuales del toast
const toastVariants = cva(

	// Clases base del toast
	'data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full',

	{
		variants: {
			variant: {

				// Toast normal
				default: 'bg-background border',

				// Toast para errores
				destructive:
          'group destructive border-destructive bg-destructive text-destructive-foreground',
			},
		},

		// Variante por defecto
		defaultVariants: {
			variant: 'default',
		},
	},
);


// Componente principal del Toast
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}

			// Aplica variantes y clases adicionales
			className={cn(toastVariants({ variant }), className)}

			{...props}
		/>
	);
});

// Nombre del componente
Toast.displayName = ToastPrimitives.Root.displayName;


// Boton de accion dentro del Toast (por ejemplo Reintentar)
const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}

		className={cn(
			'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-destructive/30 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
			className,
		)}

		{...props}
	/>
));

ToastAction.displayName = ToastPrimitives.Action.displayName;


// Boton para cerrar el Toast
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}

		className={cn(
			'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
			className,
		)}

		// Atributo usado por Radix para cerrar el toast
		toast-close=""

		{...props}
	>

		{/* Icono de cerrar */}
		<X className="h-4 w-4" />

	</ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;


// Titulo del toast
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}

		className={cn('text-sm font-semibold', className)}

		{...props}
	/>
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;


// Texto o descripcion del toast
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}

		className={cn('text-sm opacity-90', className)}

		{...props}
	/>
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;


// Exporta los componentes para usarlos en otras partes de la app
export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};