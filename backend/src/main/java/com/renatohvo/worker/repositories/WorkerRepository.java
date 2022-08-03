package com.renatohvo.worker.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.renatohvo.worker.entities.Worker;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
	
}
