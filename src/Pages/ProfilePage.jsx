import { Avatar, Container } from "@mui/material";
import { useTheme } from "@emotion/react";
import * as React from'react'
import Navbar from "../Components/Navbar";
export default function ProfilePage() {
  const theme = useTheme()
  return(
    <>
    <Navbar/>
    <Container maxWidth={'md'} sx={{pt:6}}>
      <Avatar sx={{background:theme.palette.secondary.dark,}}>
        G
      </Avatar>
    </Container>
    </>
  )
}