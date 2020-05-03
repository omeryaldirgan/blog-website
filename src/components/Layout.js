import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import {Col,Row} from 'reactstrap'
import Header from "./Header"
import Footer from "./Footer"
import Sidebar from "./Sidebar"
import "../styles/index.scss"

const Layout = ({ children,pageTitle,authorImageFluid,postAuthor}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className='container' id='content'>
        <h1>{pageTitle}</h1>
        <main>
          <Row>
            <Col md="8">{children}</Col>
            <Col md="4"><Sidebar author={postAuthor} authorFuild={authorImageFluid}/></Col>
          </Row>
        </main>
      </div>
      <Footer/>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
