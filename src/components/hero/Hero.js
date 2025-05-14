'use client';

import { HeroPanel } from "author-design-system-react";

const heroWrapper = {
    marginTop: '-2.5rem',
    marginLeft: '-100%',
    marginRight: '-100%',
    marginBottom: '2.5rem'
};
 
export default function Hero(props){
    return (
        <>
            <div style={heroWrapper}>
                <HeroPanel {...props}/>            
            </div>
        </>
  );
}
