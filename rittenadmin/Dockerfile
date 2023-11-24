FROM openjdk:21
WORKDIR /app
EXPOSE 8080
COPY target/rittenadmin.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]