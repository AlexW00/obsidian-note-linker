use thiserror::Error;

#[derive(Error, Debug)]
pub enum MatchingError {
    #[error("Failed to get link matches")]
    GetLinkMatchesError(),
}