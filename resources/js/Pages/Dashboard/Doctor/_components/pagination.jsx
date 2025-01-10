import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/Components/ui/pagination";

const PaginationComponent = ({ data, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= data.last_page; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Page */}
                <PaginationItem>
                    <PaginationPrevious
                        href={data.prev_page_url || "#"}
                        disabled={!data.prev_page_url}
                        onClick={() => onPageChange(data.current_page - 1)}
                    />
                </PaginationItem>

                {/* Page Number Links */}
                {pageNumbers.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                        <PaginationLink
                            href={data.path + `?page=${pageNumber}`}
                            isActive={data.current_page === pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Ellipsis for more pages (optional) */}
                {data.last_page > 5 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next Page */}
                <PaginationItem>
                    <PaginationNext
                        href={data.next_page_url || "#"}
                        disabled={!data.next_page_url}
                        onClick={() => onPageChange(data.current_page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;