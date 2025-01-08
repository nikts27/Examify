FROM openjdk:17-jdk-slim-buster
WORKDIR /app
COPY /target/examify-0.0.1-SNAPSHOT.jar /app/examify.jar
EXPOSE 5456
ENTRYPOINT ["java", "-jar", "examify.jar"]