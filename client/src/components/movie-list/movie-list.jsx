import React from 'react';
import { MovieCard } from '../movie-card/movie-card';

export function MovieList(props) {
    return (
        props.movies.length
            ?
            props.movies.map(m => {
                return <MovieCard key={m._id} movie={m} showOpen={true} />;
            })
            :
            <div>No Movies</div>
    )
}