import { createContext } from "react"

// context page 
export interface CurrentPageContextType {
    currentPage: number | undefined
    setCurrentPage: (currentPage: number) => void
    pageCount: number | undefined
    setPageCount: (pageCount: number) => void
}

export const PageContext = createContext<CurrentPageContextType | undefined>(undefined)

export interface RefreshContextType {
    isRefresh: boolean
    setRefresh: (isRefresh: boolean) => void
}

export const RefreshContext = createContext<RefreshContextType | undefined>(undefined)