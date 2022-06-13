use thiserror::Error;

#[derive(Error, Debug)]
pub enum CastError {
    #[error("Failed to cast Captures → Regex Match")]
    CapturesToRegexMatch(),
}