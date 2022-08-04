package com.renatohvo.worker.services;

import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.renatohvo.worker.dto.WorkerDTO;
import com.renatohvo.worker.entities.Worker;
import com.renatohvo.worker.repositories.WorkerRepository;
import com.renatohvo.worker.services.exceptions.DatabaseException;
import com.renatohvo.worker.services.exceptions.ResourceNotFoundException;

@Service
public class WorkerService {

	@Autowired
	private WorkerRepository repository;

	@Transactional(readOnly = true)
	public Page<WorkerDTO> findAllPaged(PageRequest pageRequest) {
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
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return new WorkerDTO(entity);
	}

	@Transactional
	public WorkerDTO update(Long id, WorkerDTO dto) {
		try {
			Worker entity = repository.getOne(id);
			copyDtoToEntity(dto , entity);
			entity = repository.save(entity);
			return new WorkerDTO(entity);
		}
		catch(EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID NOT FOUND: " + id);
		}
	}
	
	public void delete(Long id) {
		try {
			repository.deleteById(id);
		}
		catch(EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("ID NOT FOUND: " + id);
		}
		catch(DataIntegrityViolationException e) {
			throw new DatabaseException("INTEGRITY VIOLATION");
		}
	}

	private void copyDtoToEntity(WorkerDTO dto, Worker entity) {
		entity.setName(dto.getName());
		entity.setCpf(dto.getCpf());
		entity.setIncome(dto.getIncome());
		entity.setBirthDate(dto.getBirthDate());
		entity.setChildren(dto.getChildren());
	}

}
