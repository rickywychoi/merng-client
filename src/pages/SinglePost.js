import React, { useContext } from 'react'

import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import CommentCard from '../containers/Comment/CommentCard'
import CommentForm from '../containers/Comment/CommentForm'
import MyPopup from '../util/MyPopup'

function SinglePost (props) {
  const postId = props.match.params.postId
  const { user } = useContext(AuthContext)

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })

  const post = data && data.getPost

  function deletePostCallback () {
    props.history.push('/')
  }

  let postMarkup

  if (!post) {
    postMarkup = <p>Loading post...</p>
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = post

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content='Comment on post'>
                  <Button
                    as='div'
                    labelPosition='right'
                    onClick={() => console.log('Comment on post')}
                  >
                    <Button basic color='blue'>
                      <Icon name='comments' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={postId} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && <CommentForm postId={postId} />}
            {comments.map(comment => (
              <CommentCard comment={comment} user={user} postId={postId} />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup
}

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

export default SinglePost
