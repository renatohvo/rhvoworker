FROM openjdk:11
VOLUME /tmp
EXPOSE 8080
ADD ./target/rhvoworker-0.0.1-SNAPSHOT.jar rhvoworker.jar
ENTRYPOINT ["java","-jar","/rhvoworker.jar"]
