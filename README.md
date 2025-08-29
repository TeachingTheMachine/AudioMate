# AudioMate - TTS API Testing Tool 🎙️ 

**TTS API Testing Tool** is a text-to-speech API comparison platform that allows developers and content creators to test, compare, and evaluate different TTS providers with real-time audio generation and comprehensive testing capabilities.

## What It Solves 📝

Choosing the right text-to-speech API for a project requires extensive testing across different providers, voice options, and settings. Traditional TTS evaluation involves writing custom scripts, managing multiple API keys, and building comparison interfaces from scratch. TTS API Testing Tool eliminates these barriers by providing a unified testing environment where you can instantly compare providers like OpenAI and ElevenLabs with consistent interface and comprehensive audio analysis.

## How It Works 🤝

The system uses a streamlined, workflow:
- **Smart Text Input**: Enter any text content with real-time character counting and validation
- **Provider Selection**: Choose between leading TTS APIs (OpenAI, ElevenLabs) with dynamic voice options
- **Voice Customization**: Select from provider-specific voices with speed and quality controls
- **Instant Generation**: Real-time audio generation with progress tracking and error handling
- **Audio Analysis**: Built-in player with download, sharing, and playback controls
- **Test History**: Comprehensive logging of all tests with performance metrics and API usage tracking

## Tech Stack 🛠️

Built with **React TypeScript** for the modern frontend experience, **Express.js** backend for API orchestration, powered by **OpenAI TTS** and **ElevenLabs APIs** for voice generation, with **TanStack Query** for efficient state management and caching.

## Architecture 🏗️

AudioMate TTS API Testing Tool is built on a clean, scalable architecture designed for API testing and comparison workflows.

### Core Components

**Modern React Frontend**
- **TypeScript Application**: Type-safe React components with comprehensive error handling
- **Responsive Design**: Professional sage green theme with custom graphics and glassmorphism effects
- **Real-time Forms**: React Hook Form with Zod validation for robust input handling
- **Audio Components**: Custom audio player with progress tracking, download, and sharing capabilities

**Express Backend API**
- **Modular Architecture**: Clean separation between routes, storage, and TTS client integrations
- **Provider Abstraction**: Unified interface for multiple TTS providers with provider-specific optimizations
- **Request Management**: Comprehensive logging, rate limiting awareness, and error handling
- **Storage Interface**: Abstract storage layer supporting both in-memory and database persistence

**TTS Provider Integration**
- **OpenAI TTS Client**: Full integration with OpenAI's TTS-1 model supporting all voice options and speeds
- **ElevenLabs Client**: Integration with voice ID mapping and quality settings
- **Error Handling**: Robust API error management with detailed logging and user feedback
- **Performance Tracking**: Request counting, response time monitoring, and usage analytics

### Processing Flow
Text input → Provider selection → Voice configuration → API request → Audio generation → Playback interface → Test logging → History tracking

## Provider Support ⚙️

The system supports multiple leading TTS providers with comprehensive voice options and settings.

**OpenAI TTS Integration**
- **Voice Options**: Alloy, Echo, Fable, Onyx, Nova, Shimmer - professional voices for different use cases
- **Speed Control**: Variable speed settings from 0.25x to 4.0x with real-time adjustment
- **Model Support**: TTS-1 model with high-quality audio output optimized for various content types
- **Format Support**: MP3 audio output with base64 encoding for immediate playback

**ElevenLabs Integration**
- **Premium Voices**: Rachel, Domi, Bella, Antoni, Elli, Josh - high-quality natural voices
- **Quality Settings**: Stability and similarity boost controls for voice consistency
- **Model Selection**: Eleven Monolingual V1 model for optimal English speech generation
- **Advanced Controls**: Fine-tuned voice parameters for professional audio production

## Why It's Effective 🌟

- **Unified Testing Environment**: Compare multiple TTS providers in a single, consistent interface
- **Real-time Comparison**: Instant audio generation with side-by-side testing capabilities
- **Professional Audio Quality**: High-fidelity output from leading TTS providers
- **Comprehensive Logging**: Detailed test history with performance metrics and usage tracking
- **Developer-Friendly**: Clean API design and error handling suitable for integration testing
- **Cost Awareness**: Request counting and usage monitoring to track API consumption

## Voice Selection 🎙️

**OpenAI Voices**
- **Alloy**: Balanced and clear - ideal for general content and documentation
- **Echo**: Professional and authoritative - perfect for business presentations
- **Fable**: Expressive and engaging - excellent for storytelling and creative content
- **Onyx**: Deep and commanding - suited for serious or technical content
- **Nova**: Bright and friendly - great for educational and instructional material
- **Shimmer**: Warm and gentle - perfect for calm, accessible content

**ElevenLabs Voices**
- **Rachel**: Natural female voice - versatile for various content types
- **Domi**: Confident female voice - ideal for professional presentations
- **Bella**: Expressive female voice - perfect for creative and engaging content
- **Antoni**: Clear male voice - excellent for narration and explanatory content
- **Elli**: Youthful female voice - great for modern, approachable content
- **Josh**: Professional male voice - suited for business and technical content

## Professional Features 🏆

**Advanced Testing Interface**
- **Dynamic Voice Options**: Voice selections automatically update based on selected provider
- **Real-time Validation**: Input validation with character limits and provider-specific constraints
- **Progress Tracking**: Visual feedback during audio generation with detailed status updates
- **Error Recovery**: Comprehensive error handling with informative user feedback and retry mechanisms

**Audio Management**
- **Professional Playback**: Custom audio player with play/pause, progress scrubbing, and time display
- **Download Functionality**: Direct audio file downloads with proper file naming
- **Share Capabilities**: Easy sharing of generated audio with proper attribution
- **Quality Analysis**: Audio file size reporting and generation time tracking

**Test History & Analytics**
- **Comprehensive Logging**: All tests logged with timestamp, provider, settings, and performance data
- **Usage Tracking**: API request counting with hourly usage monitoring
- **Performance Metrics**: Generation time tracking and success/failure rate analysis
- **Provider Comparison**: Side-by-side comparison of different providers and settings

## Current Features & Opportunities 🎯

**Production Ready Features**
- **Multi-Provider Support**: Seamless switching between OpenAI and ElevenLabs with provider-specific optimizations
- **Professional UI**: Modern sage green theme with custom graphics and responsive design
- **Robust Error Handling**: Comprehensive error management with detailed logging and user feedback
- **Performance Monitoring**: Request tracking, response time analysis, and usage analytics

**Development Opportunities**
AudioMate TTS API Testing Tool represents an excellent foundation for community contributions. Key areas where the project could benefit from developer involvement:

- **Additional Providers**: Integration with Azure Cognitive Services, Google Cloud TTS, AWS Polly
- **Batch Testing**: Support for testing multiple text samples simultaneously across providers
- **A/B Testing Tools**: Side-by-side audio comparison with rating and preference tracking
- **Voice Cloning**: Integration with custom voice training and cloning capabilities
- **Advanced Analytics**: Detailed cost analysis, quality metrics, and provider performance comparisons
- **Export Capabilities**: Bulk export of test results and audio files with comprehensive reporting

## Getting Started 🚀

**Demo Video**
📹 [Watch Demo Video](./client/src/assets/videoDemo.mp4) - See AudioMate in action with a complete walkthrough of features and capabilities

**Simple Three-Step Process**
1. **Input**: Enter your text content and select a TTS provider
2. **Configure**: Choose voice options and adjust settings for optimal results
3. **Generate**: Create high-quality audio with instant playback and download options

**System Requirements**
- Modern web browser with HTML5 audio support
- Internet connection for TTS API access
- Valid API keys for OpenAI and/or ElevenLabs services

## Professional Use Cases 💼

**API Integration Testing**
- **Provider Evaluation**: Compare voice quality and performance across different TTS services
- **Voice Selection**: Test different voices for specific content types and audiences
- **Performance Analysis**: Evaluate response times and reliability for production use
- **Cost Optimization**: Analyze usage patterns and costs across different providers

**Content Creation**
- **Prototype Development**: Rapid voice testing for application development
- **Content Planning**: Voice selection for podcasts, videos, and audio content
- **Accessibility Testing**: Evaluate TTS quality for accessibility implementations
- **Brand Voice**: Establish consistent voice selection for brand content

**Development & Research**
- **Integration Planning**: Test API responses and audio quality before implementation
- **Voice Research**: Academic and commercial research into TTS voice quality and effectiveness
- **Quality Assurance**: Systematic testing of TTS implementations across different providers
- **Benchmark Creation**: Establish performance baselines for TTS provider comparison

AudioMate TTS API Testing Tool bridges the gap between complex TTS provider evaluation and accessible, streamlined testing workflows. The platform provides professional-grade testing capabilities while maintaining ease of use for both developers and content creators.

---

**Contributing**: We welcome contributions from the community, especially in expanding provider support and advanced testing capabilities. The codebase is designed for extensibility and follows modern React and Node.js best practices.