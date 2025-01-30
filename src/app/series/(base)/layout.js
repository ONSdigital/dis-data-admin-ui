import HeroPanel from "@/components/heroPanel/HeroPanel";

export default function SeriesLayout({ children }) {
    return (
        <>
            <HeroPanel hyperLink={{ text: 'Add New Dataset Series', url: 'series/create'}} title="Dataset Series" wide/>
            {children}
        </>
    )
}
