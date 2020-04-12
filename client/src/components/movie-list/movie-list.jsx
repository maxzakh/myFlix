import React from 'react';
import { MovieCard } from '../movie-card/movie-card';
import './movie-list.scss';

export function MovieList(props) {
    return (
        <div className='movie-list'>
            {props.movies.length
                ?
                props.movies.map(m => {
                    return <MovieCard key={m._id} movie={m} showOpen={true} />;
                })
                :
                <div>No Movies</div>
            }
        </div>
    )
}