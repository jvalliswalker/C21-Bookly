import { Container, Card, Button, Row, Col } from "react-bootstrap";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  const { loading, error, data: userDataFromQueryMe } = useQuery(GET_ME);

  const [deleteBook, { error: deleteBookError, data: userDataFromDeleteBook }] =
    useMutation(REMOVE_BOOK, {
      refetchQueries: [GET_ME, "me"],
    });

  const userData = userDataFromDeleteBook?.me || userDataFromQueryMe?.me || {};

  if (loading || !userData?.savedBooks) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>An error occurred</div>;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const vars = { variables: { bookId: bookId } };

    try {
      const { data } = await deleteBook(vars);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.id}>
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
