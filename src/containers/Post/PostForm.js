import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

import { useForm } from '../../util/hooks'
import { FETCH_POSTS_QUERY } from '../../util/graphql'


function PostForm () {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  })

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      // updates new posts right away by writing them into cache
      proxy.writeQuery({ 
        query: FETCH_POSTS_QUERY, 
        data: {
          getPosts: [result.data.createPost, ...data.getPosts]
        }
      })
      values.body = ''
    }
  })

  function createPostCallback () {
    createPost()
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
        <h2>Create a post {'>'}</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hi World!'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {/* TODO: Need to not display error page with codes error is made */}
      {error && (
        <div className="ui error message" style={{ marginBottom: '20px' }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id body username createdAt
      likes {
        id username createdAt
      }
      likeCount
      comments {
        id body username createdAt
      }
      commentCount
    }
  }
`

export default PostForm
