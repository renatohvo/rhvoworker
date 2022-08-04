package com.renatohvo.worker.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.renatohvo.worker.dto.WorkerDTO;
import com.renatohvo.worker.entities.Worker;
import com.renatohvo.worker.repositories.WorkerRepository;
import com.renatohvo.worker.services.exceptions.ResourceNotFoundException;

@Service
public class WorkerService {
	
	@Autowired
	private WorkerRepository repository;

	@Transactional(readOnly = true)
	public Page<WorkerDTO> findAllPaged(PageRequest pageRequest){
		Page<Worker> list = repository.findAll(pageRequest);
		return list.map(entity -> new WorkerDTO(entity));
	}
	
	@Transactional(readOnly = true)
	public WorkerDTO findById(Long id) {
		Optional<Worker> obj = repository.findById(id);
		Worker entity = obj.orElseThrow(() -> new ResourceNotFoundException("ENTITY NOT FOUND"));
		return new WorkerDTO(entity);
	}
	
	@Transactional
	public WorkerDTO insert(WorkerDTO dto) {
		Worker entity = new Worker();
		copyDtoToEntity(dto , entity);
		entity = repository.save(entity);
		return new WorkerDTO(entity);
	}

	private void copyDtoToEntity(WorkerDTO dto, Worker entity) {
		entity.setName(dto.getName());		
		entity.setCpf(dto.getCpf());		
		entity.setIncome(dto.getIncome());		
		entity.setBirthDate(dto.getBirthDate());		
		entity.setChildren(dto.getChildren());		
	}

}
