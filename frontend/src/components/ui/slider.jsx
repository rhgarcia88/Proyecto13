import * as SliderPrimitive from '@radix-ui/react-slider';
import React from 'react';
import { cn } from '@/lib/utils'; // Asegúrate de tener esta función para concatenar clases

const Slider = React.forwardRef((props, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        props.className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-gray-200 ">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-black shadow-md ring-0" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = 'Slider';

export { Slider };
