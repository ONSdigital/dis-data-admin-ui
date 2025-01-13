import { useRouter } from 'next/navigation'

import { Toolbar } from "author-design-system-react"
import { Button } from "author-design-system-react";

export default function DatasetsToolbar({  }) {
    const router = useRouter()

    const toolbarProps = {
        leftButtons: [
            <Button key="create-dataset-button" onClick={() => router.push('/datasets/create')} text="Create Dataset" variants="navigation"/>,
        ],
    };

    return (
          <>
              <Toolbar {...toolbarProps}>
              </Toolbar>
          </>
    )
}