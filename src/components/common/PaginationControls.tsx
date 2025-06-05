"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  basePath?: string;
}

export default function PaginationControls({ totalPages, currentPage, basePath = '/' }: PaginationControlsProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild
      >
        <Link href={createPageURL(currentPage - 1)} scroll={false}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous page</span>
        </Link>
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="icon"
          asChild
        >
          <Link href={createPageURL(page)} scroll={false}>
            {page}
            <span className="sr-only">Page {page}</span>
          </Link>
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        asChild
      >
        <Link href={createPageURL(currentPage + 1)} scroll={false}>
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next page</span>
        </Link>
      </Button>
    </div>
  );
}
