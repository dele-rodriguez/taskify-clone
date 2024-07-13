import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ClerkProvider } from '@clerk/nextjs';
import {Toaster} from "sonner";
 
const PlatformLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <div className='h-full'>
          <Toaster />
          <ModalProvider />
          {children}
        </div>
      </QueryProvider>
    </ClerkProvider>
  )
}

export default PlatformLayout;