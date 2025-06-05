
// lucide-react.d.ts
declare module 'lucide-react' {
    import { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';
  
    // Define a more generic type for icons if specific ones cause issues
    // This is a fallback if you can't list all used icons or if new ones are added frequently.
    export type LucideIcon = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;
  
    // It's still best practice to list icons you *know* you use:
    export const Home: LucideIcon;
    export const FileText: LucideIcon;
    export const Settings: LucideIcon;
    export const PlusCircle: LucideIcon;
    export const Trash2: LucideIcon;
    export const Edit: LucideIcon;
    export const Eye: LucideIcon;
    export const CalendarDays: LucideIcon;
    export const UserCircle: LucideIcon;
    export const Tags: LucideIcon;
    export const Folder: LucideIcon;
    export const ArrowLeft: LucideIcon;
    export const LogIn: LucideIcon;
    export const LogOut: LucideIcon; // Added LogOut
    export const UserPlus: LucideIcon;
    export const ChevronLeft: LucideIcon;
    export const ChevronRight: LucideIcon;
    export const ArrowRight: LucideIcon;
    export const BookOpenText: LucideIcon;
    export const ShieldCheck: LucideIcon;
    export const ShieldAlert: LucideIcon; // Added ShieldAlert
    export const Check: LucideIcon;
    export const X: LucideIcon;
    export const Circle: LucideIcon;
    export const PanelLeft: LucideIcon;
    export const Code: LucideIcon; 
    // Add other icons your application uses here by name
  
    // Fallback for any icon not explicitly listed (less type-safe but avoids build errors for missing declarations)
    // You can use a more specific type if you know the general structure of lucide-react icons
    // For example, if AdCircleIcon is not standard, you might have to find an alternative or ensure it exists.
    // If AdCircleIcon doesn't exist in lucide-react, you should replace it with an existing one or an SVG.
    // For the purpose of this example, let's assume you might use a generic icon or a placeholder.
    // If 'AdCircleIcon' is a custom icon or from a different library, this declaration won't make it work.
    // For now, let's ensure all used icons are standard.
    // export const AdCircleIcon: LucideIcon; // Example: if this was a real lucide icon
  
    // To make it more robust for any icon name:
    const icons: Record<string, LucideIcon>;
    export default icons;
  }
  
