import React from 'react';
import './movie-view.scss';
import { MovieCard } from '../movie-card/movie-card';

export function MovieView(props) {
    const { movie } = props;

    if (!movie) {
        return null;
    }

    return (
        <MovieCard movie={movie} showOpen={false} />
    );
}