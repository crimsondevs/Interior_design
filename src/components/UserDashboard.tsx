import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Adjust import paths as needed
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './../context/AuthContext'; // Adjust the import path as needed
import { Container, TextField, Button, Typography, Box, CircularProgress, IconButton, Grid, Paper, Alert } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { MdEmail, MdPerson, MdPhoneAndroid, MdUpdate, MdLockReset } from 'react-icons/md';
import { Redirect } from 'react-router-dom'; // Import Redirect for navigation

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(4),
        backgroundColor: 'white',
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)',
        borderRadius: theme.shape.borderRadius,
    },
    title: {
        color: '#9c27b0', // Purple
        textAlign: 'center',
        marginBottom: theme.spacing(4),
    },
    input: {
        margin: theme.spacing(1, 0),
    },
    button: {
        margin: theme.spacing(2, 0),
        backgroundColor: '#e91e63', // Pink
        color: 'white',
        '&:hover': {
            backgroundColor: '#ad1457',
        },
    },
    icon: {
        marginRight: theme.spacing(10),
    },
    outlinedInput: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'green', // Change the border color
            borderWidth: '2px', // Change the border width
          },
          '&:hover fieldset': {
            borderColor: 'red', // Change the border color on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: 'purple', // Change the border color when focused
          },
        },
      },
}));

const UserDashboard = () => {
    const classes = useStyles();
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (!currentUser) return; // Early return if not logged in
        
        const fetchUserData = async () => {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setName(userSnap.data().name);
                setContact(userSnap.data().contact);
            }
        };

        fetchUserData();
    }, [currentUser]);

    if (!currentUser) {
        // If the user is not logged in, show an error message or redirect
        // You can return a simple message, or use <Redirect to="/login" /> from react-router-dom to redirect
        return (
            <Container className={classes.container} maxWidth="sm">
                <Typography variant="h6" color="error">
                    You must be logged in to view this page. Please <a href="/login">log in</a>.
                </Typography>
            </Container>
        );
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                name: name,
                contact: contact,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleChangePassword = () => {
        sendPasswordResetEmail(auth, currentUser.email).then(() => {
            alert('Password reset email sent!');
        }).catch((error) => {
            alert(error.message);
        });
    };

    return (
<Container className={classes.container} maxWidth="sm">
    <Typography variant="h4" className={classes.title}>User Dashboard</Typography>
    <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={1}>
            <MdEmail color="action" />
        </Grid>
        <Grid item xs={11}>
            <TextField
                margin='normal'
                required
                fullWidth
                id="email"
                name="email"
                autoFocus
                autoComplete="email"
                color="secondary"
                label="Email"
                value={currentUser.email}
                fullWidth
            />
        </Grid>
    </Grid>
    <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={1}>
            <MdPerson color="action" />
        </Grid>
        <Grid item xs={11}>
            <TextField
                margin='normal'
                required
                fullWidth
                id="name"
                name="name"
                autoFocus
                autoComplete="name"
                color="secondary"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </Grid>
    </Grid>
    <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={1}>
            <MdPhoneAndroid color="action" />
        </Grid>
        <Grid item xs={11}>
            <TextField
                margin='normal'
                required
                fullWidth
                id="contact"
                label="Contact"
                name="contact"
                autoFocus
                autoComplete="contact"
                color="secondary"
                value={contact}
                onChange={(e) => setContact(e.target.value)}

            />
        </Grid>
    </Grid>
    <Grid container spacing={2} justifyContent="center">
        <Grid item>
            <Button
                startIcon={loading ? <CircularProgress size={24} /> : <MdUpdate />}
                variant="contained"
                className={classes.button}
                onClick={handleUpdate}
                disabled={loading}
            >
                Update Profile
            </Button>
        </Grid>
        <Grid item>
            <Button
                startIcon={<MdLockReset />}
                variant="contained"
                className={classes.button}
                onClick={handleChangePassword}
                disabled={loading}
            >
                Change Password
            </Button>
        </Grid>
    </Grid>
</Container>
    );
};

export default UserDashboard;