import "./App.css";
import { useState, useEffect } from "react";
import { FormControl, InputGroup, Container, Button } from "react-bootstrap";
import { Card, Row } from "react-bootstrap";



const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);


  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
  const searchParameters = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const artistResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
    searchParameters
  );
  const artistData = await artistResponse.json();
  const artistID = artistData.artists.items[0].id;

  const albumResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistID}/albums`,
    searchParameters
  );
  const albumData = await albumResponse.json();
  setAlbums(albumData.items);

}


return (
  <>
    {/* Search Bar */}
    <Container>
      <InputGroup>
        <FormControl
          placeholder="Search For Artist"
          type="input"
          aria-label="Search for an Artist"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              search();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{
            width: "300px",
            height: "35px",
            borderRadius: "5px",
            marginRight: "10px",
            paddingLeft: "10px",
          }}
        />
        <Button onClick={search}>
          Search
        </Button>
      </InputGroup>
    </Container>

    {/* Album Cards */}
    <Container>
      <Row style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "20px"
      }}>
        {albums.map(album => (
          <Card key={album.id} style={{
            width: "200px",
            margin: "10px",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa"
          }}>
            <Card.Img variant="top" src={album.images[0]?.url} />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
              <Card.Text>Release Date: {album.release_date}</Card.Text>
              <Button variant="dark" href={album.external_urls.spotify} target="_blank">
                Open in Spotify
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  </>
);

}

export default App;
