"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface ModalProps {
  src: string;
  alt?: string;
}

export default function Modal({ src, alt }: ModalProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogHeader>
        <DialogTitle>Image Preview</DialogTitle>
      </DialogHeader>
      <DialogContent className="sm:max-w-5xl ">
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt ?? "Image preview"}
            className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-md"
            loading="eager"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
