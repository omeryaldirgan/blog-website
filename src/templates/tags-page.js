import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/Seo"

import { Badge, Button } from 'reactstrap'
import { slugify } from '../util/utility'

const tagsPage = ({pageContext}) => {
  const {tags,tagsPostCounts}=pageContext;
  return(
    <Layout pageTitle='App Tags'>
      <SEO title="Team"   keywords={['tags','topics']}/>
      <ul>
        {tags.map(tag => (
          <li key={tag} style={{ marginBottom: '10px' }}>
            <Button color="primary" href={`/tag/${slugify(tag)}`}>
              {tag} <Badge color="light">{tagsPostCounts[tag]}</Badge>
            </Button>
          </li>
        ))}
      </ul>
  </Layout>
  )
}

export default tagsPage
