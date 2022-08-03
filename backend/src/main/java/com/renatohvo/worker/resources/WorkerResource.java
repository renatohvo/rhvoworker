package com.renatohvo.worker.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.renatohvo.worker.dto.WorkerDTO;
import com.renatohvo.worker.services.WorkerService;

@Controller
@RequestMapping(value = "/workers")
public class WorkerResource {
	
	@Autowired
	private WorkerService service;
	
	@GetMapping
	public ResponseEntity<Page<WorkerDTO>> findAll(
			@RequestParam(value = "page", defaultValue = "0") Integer page,
			@RequestParam(value = "linesPerPage", defaultValue = "5") Integer linesPerPage,
			@RequestParam(value = "direction", defaultValue = "ASC") String direction,
			@RequestParam(value = "orderBy", defaultValue = "name") String orderBy
			){
		
		PageRequest pageRequest = PageRequest.of(
				page, linesPerPage, Direction.valueOf(direction), orderBy);
		
		Page<WorkerDTO> list = service.findAllPaged(pageRequest);
		return ResponseEntity.ok().body(list);
	}
 
}
